import Image from "next/image";

const Header = () => {
  return (
    <div className="text-center">
      <br />
      <div className="d-flex justify-content-center align-items-center gap-2">
        <h1>Hangman Overwatch</h1>
        <Image src="/images/favicon.png" alt="icon" width={60} height={60} />
      </div>
      <p className="fs-4">A hangman game of Overwatch words</p>
    </div>
  )
}

export default Header;