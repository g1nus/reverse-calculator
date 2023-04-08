import Counter from "@/components/calculator"
import style from "@/app/main.module.css"

export default function Home() {
  return (
    <main className={style.main}>
      <Counter />
    </main>
  )
}
