import React from 'react';

interface IProps {
  onChange: (e: unknown) => void;
}

const Search = ({ onChange }: IProps) => {
  return (
    <div>
      <input
        type="search"
        onChange={onChange}
        placeholder="	&#x1F50E; Search"
        className={`w-96 xsm:w-full sm:w-full lg:w-full bg-transparent border-2 border-[#ffa503] py-2 rounded-md px-5 outline-none text-white`}
      />
    </div>
  );
};

export default Search;
