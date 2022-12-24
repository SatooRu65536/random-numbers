import Head from 'next/head';
import styles from '../styles/Home.module.scss';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useEffect, useMemo, useState } from 'react';

export default function Home() {
  const [selectNum, setSelectNum] = useState<'?' | 'Fin' | number>('?');
  const [selectedNums, setSelectedNums] = useState([] as (number | 'Fin')[]);
  const [range, setRange] = useState({ min: 1, max: 40 });
  const [rangeSnap, setRangeSnap] = useState({ min: 1, max: 40 });
  const [openDialog, setOpenDialog] = useState(false);
  const [displaySettings, setDisplaySettings] = useState(true);
  const [indicateModeNum, setIndicateMode] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [hiddenNumsStr, setHiddenNumsStr] = useState('');
  const [hiddenNums, setHiddenNums] = useState([] as number[]);
  const indicateModes = ['順次', '一覧'];

  const getNumList = useMemo((): number[] => {
    const nums = [...Array(rangeSnap.max - rangeSnap.min + 1)].map((_, i) => { return Number(i) + Number(rangeSnap.min) });
    const ret = nums.filter((num, i) =>
      hiddenNums.indexOf(num) == -1
    );
    return ret;
  }, [hiddenNums, rangeSnap.max, rangeSnap.min]);

  const next = () => {
    const numsList = getNumList;
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
    const min = e.target.value == "" ? e.target.value : Math.floor(e.target.value);
    setRange({ min: min, max: range.max });
  }

  const changeMax = (e: { target: { value: any; }; }) => {
    const max = e.target.value == "" ? e.target.value : Math.floor(e.target.value);
    setRange({ min: range.min, max: max });
  }

  const changeHiddenInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let formatStr = e.target.value.replace(/[^0-9|,|、|.|ー|~|〜|-]/g, ",");
    formatStr = formatStr.replace(/[、|.]/g, ',');
    formatStr = formatStr.replace(/[ー|〜|-]/g, '~');
    formatStr = formatStr.replace(/,+/g, ',');
    formatStr = formatStr.replace(/~+/g, '~');
    formatStr = formatStr.replace(/^[,|~]/g, '');
    setHiddenNumsStr(formatStr);
  }

  const blurHiddenInput = () => {
    const formatStrSplit = hiddenNumsStr.split(',');
    const hiddenList: number[] = [];
    for (let i = 0; i < formatStrSplit.length; i++) {
      const str = formatStrSplit[i];

      if (str.match('~')) {
        console.log(str);
        const range = str.split('~');
        if (range.length != 2 || Number(range[0]) >= Number(range[1])) {
          setErrorMessage('範囲が正しくありません');
          console.log('error', errorMessage);
          return;
        }
        for (let n = Number(range[0]); n <= Number(range[1]); n++) {
          hiddenList.push(n);
        }
      } else {
        const n = Number(str);
        if (typeof (n) !== 'number') {
          setErrorMessage('なにかがおかしいです');
          console.log('error', errorMessage);
          return;
        }
        hiddenList.push(n);
      }
    }
    setErrorMessage('');
    const numList = [...Array(range.max - range.min + 1)].map((_, i) => { return Number(i) + Number(range.min) });
    const hiddenListSnap = hiddenList.filter((num, i) =>
      numList.indexOf(num) != -1 && hiddenList.indexOf(num) == i);
    setHiddenNums(hiddenListSnap.sort((a, b) => { return a - b }));
  }

  const removeHiddenNums = () => {
    setHiddenNums([]);
    setHiddenNumsStr('');
  }

  const switchOpenDialog = () => {
    if (!openDialog) {
      setOpenDialog(true);
      return;
    }

    if (range.min.toString.length == 0 || range.max.toString.length == 0) {
      setErrorMessage('空白は指定できません');
    } else if (range.min > range.max) {
      setErrorMessage('最小値と最大値が反対です');
    } else if (range.min == range.max) {
      setErrorMessage('最小値と最大値が同じです');
    } else if (range.min < 0) {
      setErrorMessage('0~999の範囲内で指定してください');
    } else if (range.max >= 1000) {
      setErrorMessage('0~999の範囲内で指定してください');
    } else {
      setRangeSnap({ min: range.min, max: range.max });
      setErrorMessage('');
      setOpenDialog(false);
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
        <div className={`${styles.dialog} ${displaySettings && styles.active}`}>
          <div className={styles.setting}>
            <div className={styles.mode_container} onClick={switchIndicateMode}>
              <span>表示モード</span>
              <span className={styles.mode}>{indicateModes[indicateModeNum]}</span>
            </div>

            <div className={styles.container}>
              <input type="number" id="min" value={range.min} onChange={changeMin} />
              <span className={styles.range}>~</span>
              <input type="number" id="max" value={range.max} onChange={changeMax} />
              <span
                className={styles.to_hidden}
                onClick={() => { setDisplaySettings(false) }}
              >除外</span>
            </div>

            <div className={styles.reset} onClick={() => reset()}>
              RESET
            </div>

            <p className={styles.error_message}>{errorMessage}</p>
          </div>
        </div>

        <div className={`${styles.dialog} ${!displaySettings && styles.active}`}>
          <div className={styles.hidden_container}>
            <p className={styles.arrow_back_container} onClick={() => { setDisplaySettings(true) }}>
              <ArrowBackIcon className={styles.arrow_back} />
            </p>
            <h2>除外リスト</h2>

            <div className={styles.input_hidden}>
              <input
                type="text"
                value={hiddenNumsStr}
                onChange={changeHiddenInput}
                onBlur={() => { blurHiddenInput() }}
              />
              <span onClick={() => { removeHiddenNums() }}>全削</span>
            </div>

            <p className={styles.error_message}>{errorMessage}</p>

            <div className={styles.hidden_list}>
              {hiddenNums.map((num, i) => {
                return <span key={i} className={styles.hidden_num}>{num}</span>
              })}
            </div>
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
          {indicateModeNum == 1 && getNumList.map((num, i) => {
            return selectedNums.indexOf(num) == - 1
              ? <span key={i} className={styles.selected_num}>{num}</span>
              : <span key={i} className={`${styles.selected_num} ${styles.active}`}>{num}</span>
          })}
        </div>
      </main>
    </>
  )
}
