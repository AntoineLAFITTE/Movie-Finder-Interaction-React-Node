type Props = {
  title: string
}

export default function Header(props: Props) {
  return (
    <header>
      <h2>{props.title}</h2>
    </header>
  )
}
