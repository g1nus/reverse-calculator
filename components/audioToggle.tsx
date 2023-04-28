'use client';

import style from '@/app/audiotoggle.module.css';
import { useEffect, useState, useRef, Dispatch, SetStateAction } from 'react';

type Props = {
  muted: boolean;
  setMuted: Dispatch<SetStateAction<boolean>>;
};

export default function AudioToggle({muted, setMuted} : Props) {

  return(
    <div className={style.audio_holder} onClick={() => {setMuted(!muted)}}>
      <div style={{transform: `translateX(${!muted ? 0 : -40}px)`}} className={style.slider_holder}>
        <div className={style.audio_on}/>
        <div className={style.audio_button}/>
        <div className={style.audio_off}/>
      </div>
    </div>
  )
}
