import { GetStaticProps } from "next";
import Head from "next/head";
import Prismic from "@prismicio/client";
import getPrismicClient from "../../services/prismic";
import styles from "./styles.module.scss";
import { RichText } from "prismic-dom";
import Link from "next/link";

interface IPosts {
  posts: {
    slug: string;
    title: string;
    excerpt: string;
    updateAt: string;
  }[];
}
const posts = ({ posts }: IPosts) => {
  return (
    <>
      <Head>Posts | Ignews</Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link key={post.slug} href={`posts/${post.slug}`}>
              <a>
                <time>{post.updateAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.predicates.at("document.type", "posts")],
    { fetch: ["posts.title", "posts.content"], pageSize: 20 }
  );
  const posts = response.results.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt:
        post.data.content.find((content) => content.type === "paragraph")
          ?.text ?? "",
      updateAt: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });
  console.log(posts);

  return {
    props: {
      posts,
    },
  };
};

export default posts;
