/*
 * Elijah Cobb
 * elijah@elijahcobb.com
 * https://elijahcobb.com
 */

import type { NextPage, GetServerSideProps } from "next";

const Page: NextPage = () => <></>;

export const getServerSideProps: GetServerSideProps = async () => {
	const date = new Date();
	const month = date.getMonth();
	const day = date.getDate();
	return { redirect: { destination: `/${month}/${day}`, permanent: false } }
}

export default Page;
