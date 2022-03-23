import React from 'react';
import Image from 'next/image';
import full_logo from '../../../../public/static/full-logo.png';
import Search from './Search';
import Link from 'next/link';

interface IProps{
  background: string;
}

const Header = ({ background }: IProps) => {
  return (
    <div className={`flex flex-row justify-between items-center px-10 fixed top-0 right-0 left-0 ${background}`}>
      <Image src={full_logo} alt="ZChain" width="130" height="130" />
      <Search />
      <ul className="text-white flex flex-row justify-around w-96">
        <li>
          <Link href="/market">Explore</Link>
        </li>
        <li><Link href="/myNfts">My NFTs</Link></li>
        <li><Link href="/mint">Upload</Link></li>
      </ul>
      <button className="bg-[#ffa503] py-3 px-20 rounded-md hover:bg-opacity-80">
        Login
      </button>
    </div>
  );
}

export default Header;
