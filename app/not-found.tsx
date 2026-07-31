import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found page-shell">
      <span>404</span>
      <h1>Signal not found.</h1>
      <p>这个页面暂时没有可读取的信号。</p>
      <Link className="button button-primary" href="/">
        返回首页
      </Link>
    </main>
  );
}
