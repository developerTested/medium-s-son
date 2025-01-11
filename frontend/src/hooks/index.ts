import { useDispatch, useSelector } from 'react-redux'
import type { AppRootState, AppDispatch } from '../redux/store'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<AppRootState>()