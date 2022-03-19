import React from 'react';
import Image from 'next/image'; 'next/image';
import full_logo from '../../../../assets/images/zchain-logo.png'
import Search from './Search';

const Header = () => {
    return (
        <div className="flex flex-row justify-between items-center px-10 fixed top-0 right-52 left-0">
            <Image src={full_logo} alt="ZChain" width="130" height="130" />
            <Search />
            <ul className="text-white flex flex-row justify-between w-96 font-Roboto">
                <li>Marketplace</li>
                <li>Artists</li>
            </ul>
            <button className='bg-[#ffa503] py-3 px-10 rounded-md hover:bg-opacity-80'>Connect Wallet</button>
        </div>
    );
}

export default Header;