import { MdWbSunny } from 'react-icons/md';
import { BsMoonStarsFill } from 'react-icons/bs';
import useDarkMode from '@/hooks/useDarkMode';

export default function ThemeToggle() {

    const { theme, toggleTheme} = useDarkMode();
    
    return (
        <div onClick={toggleTheme} className="cursor-pointer flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-200 dark:hover:bg-white/20 dark:text-white">
            {theme === 'dark' ? <MdWbSunny className='w-6 h-6' /> : <BsMoonStarsFill className='w-6 h-6' />}
        </div>
    )
}
