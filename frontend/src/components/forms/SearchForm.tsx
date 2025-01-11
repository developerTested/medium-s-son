import { useRef } from 'react';
import Input from './Input'
import { CiSearch } from 'react-icons/ci';

export default function SearchForm() {

    const searchRef = useRef(null);

    const handleSubmit = () => {

    }

    return (
        <div className='hidden lg:block relative w-full xl:w-500 m-auto group border bg-slate-100 dark:bg-input border-white dark:border-input dark:text-white rounded-full'>
            <form onSubmit={handleSubmit} className='w-full flex items-center group-focus-within:shadow-lg rounded-full'>
                <Input ref={searchRef} type="search" name="search" placeholder='Connecting People...' className='bg-transparent dark:bg-transparent border-none px-4 py-2.5 outline-none' />

                <button type='submit' className='p-2 border-none outline-none bg-transparent'>
                    <CiSearch className="w-6 h-6" />
                </button>
            </form>
            <div className="hidden absolute top-full w-full rounded-b-lg shadow-lg p-2.5 bg-white">
                <div className="flex items-center">
                    Hello
                </div>
            </div>
        </div>
    )
}
