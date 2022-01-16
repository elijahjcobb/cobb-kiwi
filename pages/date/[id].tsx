/*
 * Elijah Cobb
 * elijah@elijahcobb.com
 * https://elijahcobb.com
 */

import type {NextPage, GetStaticProps, GetStaticPaths, GetServerSideProps} from "next";
import { useRouter } from "next/router";
import * as FS from "fs";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from "../../styles/Markdown.module.scss";

interface PageProps {
	images: string[];
	md: string;
	date: string;
}

const Page: NextPage<PageProps> = props => {
	return (
		<div className={styles.page}>
			<a href={"/"} className={styles.header}>
				<img className={styles.img} src={"/nz.png"} alt={"nz flag"}/>
				<h1 className={styles.title}>cobb.kiwi</h1>
			</a>
			<h2 className={styles.date}>{new Date(props.date).toDateString()}</h2>
			<div className={styles.mdContainer}>
				<ReactMarkdown className={styles.md} remarkPlugins={[remarkGfm]}>{props.md}</ReactMarkdown>
			</div>
			<div className={styles.imgs}>
				{
					props.images.map((img, i) => <img src={img} alt={"blog"} key={i}/>)
				}
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {

	const props = {images: [], md: "", date: ""}
	const err404 = { redirect: { destination: "/" }, props};

	const p = context.params;
	if (!p) return err404;
	const dateString = p.id as string;
	if (!dateString) return err404;

	console.log(dateString);

	let file: string;

	try {
		const f = FS.readFileSync("md/" + dateString + ".md");
		file = f.toString("utf8");
	} catch (e) {
		console.error(e);
		return err404;
	}

	console.log(file);

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

// export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
//
// 	const p = context.params;
// 	if (!p) return { redirect: { statusCode: 404}}
// 	const dateString = p.date as string;
// 	if (!dateString) return { redirect: { statusCode: 404}}
//
// 	console.log(dateString);
//
// 	return {
// 		props: {
// 			images: [],
// 			md: "",
// 			date: ""
// 		}
// 	}
// }

// export const getStaticPaths: GetStaticPaths = async () => {
// 	return {
// 		paths: [],
// 		fallback: false
// 	};
// }

export default Page;
