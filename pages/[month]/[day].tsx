/*
 * Elijah Cobb
 * elijah@elijahcobb.com
 * https://elijahcobb.com
 */

import type { NextPage, GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import * as FS from "fs";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from "../../styles/Markdown.module.scss";
import { useCallback } from "react";
import path from "path";

interface PageProps {
	images: string[];
	md: string;
	date: string;
}

const Page: NextPage<PageProps> = props => {

	const getDay = useCallback(() => {
		const date = new Date(props.date.replace(RegExp("-", "g"), "/") + "/2019");
		return date.toLocaleString('default', { month: 'short', day: "numeric", year: "numeric" });
	}, [props.date]);

	return (
		<div className={styles.page}>
			<a href={"/"} className={styles.header}>
				<div className={styles.left}>
					<img className={styles.img} src={"/nz.png"} alt={"nz flag"} />
					<h1 className={styles.title}>cobb.kiwi</h1>
				</div>
				<h2 className={styles.date}>{getDay()}</h2>
			</a>
			<div className={styles.mdContainer}>
				<ReactMarkdown className={styles.md} remarkPlugins={[remarkGfm]}>{props.md}</ReactMarkdown>
			</div>
			<div className={styles.imgs}>
				{
					props.images.map((img, i) => <img src={img} alt={"blog"} key={i} />)
				}
			</div>
		</div>
	);
};

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {

	const props = { images: [], md: "", date: "" }
	const err404 = { redirect: { destination: "/404" }, props };

	const p = context.params;
	if (!p) return err404;
	const monthString = p.month as string;
	const dayString = p.day as string;
	const dateString = `${monthString}-${dayString}`

	if (!dateString) return err404;

	let file: string;

	try {
		const f = FS.readFileSync("md/" + dateString + ".md");
		file = f.toString("utf8");
	} catch (e) {
		console.error(e);
		return err404;
	}

	const files = FS.readdirSync("public/img");
	const imgs: string[] = [];
	for (const f of files) {
		if (f.startsWith(dateString)) imgs.push("/img/" + f);
	}

	return {
		props: {
			images: imgs,
			md: file,
			date: dateString
		}
	}

}

export const getStaticPaths: GetStaticPaths = async () => {
	const files = FS.readdirSync('md');
	let paths: string[] = [];

	for (let file of files) {
		if (!file.endsWith(".md")) continue;
		file = file.replace(".md", "");
		const comps = file.split("-").join("/")
		paths.push(`/${comps}`);
	}

	return {
		paths,
		fallback: false
	};
}

export default Page;
