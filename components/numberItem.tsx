'use client';

import style from '@/app/numberitem.module.css';
import { SolutionNumber } from '@/types/main';
import { useEffect, useState, useRef } from 'react';

type Props = {
  item: SolutionNumber;
};

export default function NumberItem({item} : Props) {

  const isInitialMount = useRef<boolean>(true);

  const [flashing, setFlashing] = useState<boolean>(false);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if(!flashing){
        console.log("set flashing");
        setFlashing(true);
        setTimeout(() => {
          console.log("remove flashing");
          setFlashing(false);
        }, 1000);
      }
    }
  }, [item.flash])

  return(
    <span className={style.new_char}><span className={(flashing) ? `${style.flash_char}` : ``}>{item.content}</span></span>
  )
}
