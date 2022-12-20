import Head from 'next/head';
import styles from '../styles/Home.module.scss';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';

export default function Home() {
  const [selectNum, setSelectNum] = useState<'?' | 'Fin' | number>('?');
  const [selectedNums, setSelectedNums] = useState([] as (number | 'Fin')[]);
  const [range, setRange] = useState({ min: 1, max: 40 });
  const [openDialog, setOpenDialog] = useState(false);
  const [indicateModeNum, setIndicateMode] = useState(0);
  const [errorMessage, setErrorMessage] = useState(' ');
  const indicateModes = ['順次', '一覧'];

  const getNumList = (): number[] => {
    return [...Array(range.max - range.min + 1)].map((_, i) => { return Number(i) + Number(range.min) });
  }

  const next = () => {
    const numsList = getNumList();
    console.log(numsList);
    const noneSelectedList = numsList.filter(i => selectedNums.indexOf(i) == -1);
    if (noneSelectedList.length > 0) {
      const selectNum = noneSelectedList[Math.floor(Math.random() * noneSelectedList.length)];
      setSelectNum(selectNum);
      setSelectedNums([...selectedNums, selectNum]);
    } else {
      setSelectNum('Fin');
      if (selectedNums[selectedNums.length - 1] !== 'Fin') {
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

  const switchOpenDialog = () => {
    if (openDialog && range.min > range.max) {
      setErrorMessage('最小値と最大値が逆です');
    } else if (openDialog && range.min == range.max) {
      setErrorMessage('最小値と最大値が同じです');
    } else {
      setErrorMessage(' ');
      setOpenDialog(!openDialog);
    }
  }

  const reset = () => {
    setSelectNum('?');
    setSelectedNums([]);
  }

  const switchIndicateMode = () => {
    setIndicateMode((indicateModeNum + 1) % indicateModes.length);
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
            <div className={styles.mode_container} onClick={switchIndicateMode}>
              <span>表示モード</span>
              <span className={styles.mode}>{indicateModes[indicateModeNum]}</span>
            </div>

            <div className={styles.container}>
              <input type="number" id="min" value={range.min} onChange={changeMin} />
              <span className={styles.range}>~</span>
              <input type="number" id="max" value={range.max} onChange={changeMax} />
            </div>

            <div className={styles.reset} onClick={() => reset()}>
              RESET
            </div>

            <p className={styles.error_message}>{errorMessage}</p>
          </div>
        </div>
      </div>

      <main className={styles.main} onClick={() => next()}>
        <div className={styles.select_container}>
          <h1 className={styles.select_num}>{selectNum}</h1>
        </div>

        <div className={styles.selected_list}>
          {indicateModeNum == 0 && selectedNums.map((num, i) => {
            return i < selectedNums.length - 1
              ? <span key={i} className={styles.selected_num}>{num}</span>
              : <span key={i} className={`${styles.selected_num} ${styles.active}`}>{num}</span>
          })}
          {indicateModeNum == 1 && getNumList().map((num, i) => {
            return selectedNums.indexOf(num) == - 1
              ? <span key={i} className={styles.selected_num}>{num}</span>
              : <span key={i} className={`${styles.selected_num} ${styles.active}`}>{num}</span>
          })}
        </div>
      </main>
    </>
  )
}
