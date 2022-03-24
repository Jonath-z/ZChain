import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import full_logo from '../../../../public/static/full-logo.png';
import Search from './Search';
import Link from 'next/link';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { useRouter } from 'next/router';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';
import { useMediaQuery } from 'react-responsive';
import { HiOutlinePlus } from 'react-icons/hi';

interface IProps {
  background: string;
  onChange: (e: unknown) => void;
  isSearchAvailabe: boolean;
  activeMenu: string;
}

interface IMenuClass {
  className: string;
  py: string;
  activeMenu: string;
}

const Menu = ({ className, py, activeMenu }: IMenuClass) => {
  const [exploreActive, setExploreActive] = useState('text-white');
  const [MyNftActive, setMyNftActive] = useState('text-active');
  const [createNftActive, setCreateNftActive] =
    useState('text-white');

  useEffect(() => {
    setActiveMenu();
  });

  const setActiveMenu = () => {
    if (activeMenu === 'explore') {
      setExploreActive('text-[#ffa503]');
      setMyNftActive('text-white');
      setCreateNftActive('text-white');
    }
    if (activeMenu === 'my item') {
      setExploreActive('text-white');
      setMyNftActive('text-[#ffa503]');
      setCreateNftActive('text-white');
    }
    if (activeMenu === 'create nft') {
      setExploreActive('text-white');
      setMyNftActive('text-white');
      setCreateNftActive('text-[#ffa503]');
    }
  };

  return (
    <ul className={className}>
      <li className={`${py} ${exploreActive}`}>
        <Link href="/market">Explore</Link>
      </li>
      <li className={`${py} ${MyNftActive}`}>
        <Link href="/myNfts">My NFTs</Link>
      </li>
      <li className={`${py} ${createNftActive}`}>
        <Link href="/mint">Create NFT</Link>
      </li>
    </ul>
  );
};

const Header = ({
  background,
  onChange,
  isSearchAvailabe,
  activeMenu,
}: IProps) => {
  const [accountBalance, setAccountBalance] = useState('');
  const [isMenu, setIsMenu] = useState(false);
  const route = useRouter();
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });

  useEffect(() => {
    getBalance();
  }, []);

  const getBalance = async () => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const accounts = await provider.send('eth_requestAccounts', []);
    const balance = await provider.getBalance(accounts[0]);
    const amount = ethers.utils.formatEther(balance);
    const formatedBalance = Number(amount).toFixed(1).toString();
    setAccountBalance(formatedBalance);
  };

  const toggleMenu = () => {
    setIsMenu(!isMenu);
  };

  return (
    <>
      {!isMobile && (
        <div
          className={`flex flex-row justify-between items-center px-10 fixed top-0 right-0 left-0 ${background}`}
        >
          <Image
            src={full_logo}
            alt="ZChain"
            width="130"
            height="130"
            onClick={() => route.push('/')}
            className="cursor-pointer"
          />
          {isSearchAvailabe && <Search onChange={onChange} />}
          <Menu
            className="text-white flex flex-row justify-around w-96"
            py="py-0"
            activeMenu={activeMenu}
          />
          <p
            className={`bg-[#ffa503] py-3 px-10 rounded-md hover:bg-opacity-80 flex items-center`}
          >
            <MdAccountBalanceWallet />
            <span className="px-2">{accountBalance} ETH</span>
          </p>
        </div>
      )}
      {isMobile && (
        <div className="flex flex-row justify-between items-center">
          <Image
            src={full_logo}
            alt="ZChain"
            width="130"
            height="130"
            onClick={() => route.push('/')}
            className="cursor-pointer"
          />
          {isMenu && (
            <div className="bg-black flex flex-col absolute right-0 px-10 py-5 top-24 rounded-l-md z-30">
              {isSearchAvailabe && <Search onChange={onChange} />}
              <Menu
                className="flex flex-col text-white"
                py="py-3"
                activeMenu={activeMenu}
              />
              <p
                className={`bg-[#ffa503] py-3 px-10 my-5 rounded-md hover:bg-opacity-80 flex items-center`}
              >
                <MdAccountBalanceWallet />
                <span className="px-2">{accountBalance} ETH</span>
              </p>
            </div>
          )}
          {!isMenu ? (
            <HiOutlineMenuAlt1
              className="text-[#ffa503] text-5xl mx-5 bg-black py-3 px-3 rounded-full cursor-pointer"
              onClick={toggleMenu}
            />
          ) : (
            <HiOutlinePlus
              className="text-[#ffa503] text-5xl mx-5 bg-black py-3 px-3 rounded-full cursor-pointer rotate-45 transition-all duration-1000 z-10"
              onClick={toggleMenu}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Header;
