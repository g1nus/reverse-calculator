'use client';

import style from '@/app/audiotoggle.module.css';
import { useEffect, useState, useRef } from 'react';

type Props = {
  muted: boolean;
};

export default function AudioToggle({muted} : Props) {

  return(
    <div className={style.audio_holder}>
      <div className={style.audio_on}/>
      <div className={style.audio_button}/>
      <div className={style.audio_off}/>
    </div>
  )
}
