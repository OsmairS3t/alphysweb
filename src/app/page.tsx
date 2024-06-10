import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 justify-center items-center">
      <h1>Hi, man!</h1>
      <Link href="./register/category">Categorias</Link>
    </div>
  );
}
