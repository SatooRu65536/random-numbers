import Head from 'next/head';
import styles from '../styles/Home.module.scss';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';

export default function Home() {
  const [selectNum, setSelectNum] = useState<'?' | 'Fin' | number>('?');
  const [selectedNums, setSelectedNums] = useState([] as (number | 'Fin')[]);
  const [range, setRange] = useState({ min: 1, max: 40 });
  const [openDialog, setOpenDialog] = useState(false);

  const next = () => {
    const diff = range.max - range.min + 1;
    const numsList = [...Array(diff)].map((_, i) => i + range.min);
    const noneSelectedList = numsList.filter(i => selectedNums.indexOf(i) == -1);
    if (noneSelectedList.length > 0) {
      const selectNum = noneSelectedList[Math.floor(Math.random() * noneSelectedList.length)];
      setSelectNum(selectNum);
      setSelectedNums([...selectedNums, selectNum]);
    } else {
      setSelectNum('Fin');
      if (selectedNums[selectedNums.length-1] !== 'Fin') {
        setSelectedNums([...selectedNums, 'Fin']);
      }
    }
  };

  const changeMin = (e: { target: { value: any; }; }) => {
    setRange({ min: e.target.value, max: range.max });
  }

  const changeMax = (e: { target: { value: any; }; }) => {
    setRange({ min: range.min, max: e.target.value });
  }

  const blurRange = () => {
    if (range.min > range.max) {
      setRange({ min: range.max, max: range.min });
    } else if (range.min == range.max) {
      setRange({ min: range.min, max: range.min + 1 });
    }
  }

  const switchOpenDialog = () => {
    setOpenDialog(!openDialog);
  }

  const reset = () => {
    setSelectNum('?');
    setSelectedNums([]);
  }

  return (
    <>
      <Head>
        <title>Random Numbers</title>
        <meta name="description" content="select random numbers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.setting_button} onClick={() => switchOpenDialog()}>
        <SettingsIcon className={`${styles.icon} ${openDialog && styles.active}`} />
      </div>

      <div className={`${styles.dialog_surface} ${openDialog && styles.active}`}>
        <div className={styles.dialog}>
          <div className={styles.setting}>
            <div className={styles.mode_container}>
              <span>モード</span>
              <span className={styles.mode}>順次表示</span>
            </div>

            <div className={styles.container}>
              <input type="number" id="min" value={range.min} onChange={changeMin} onBlur={blurRange} />
              <span className={styles.range}>~</span>
              <input type="number" id="max" value={range.max} onChange={changeMax} onBlur={blurRange} />
            </div>

            <div className={styles.reset} onClick={() => reset()}>
              RESET
            </div>
          </div>
        </div>
      </div>

      <main className={styles.main} onClick={() => next()}>
        <div className={styles.select_container}>
          <h1 className={styles.select_num}>{selectNum}</h1>
        </div>

        <div className={styles.selected_list}>
          {selectedNums.map((num, i) => {
            return i < selectedNums.length - 1
              ? <span key={i} className={styles.selected_num}>{num}</span>
              : <span key={i} className={`${styles.selected_num} ${styles.active}`}>{num}</span>
          })}
        </div>
      </main>
    </>
  )
}
