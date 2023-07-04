import styles from './Loading.module.css';
import { PuffLoader } from 'react-spinners';

export function Loading() {
  return (
    <div className="flex flex-row justify-center text-gray-400 py-20">
      <PuffLoader color="#0070f3" />
    </div>
  );
}
