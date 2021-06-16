'use strict';

export class Janken {
  opponentEl: HTMLElement;
  myselfEl: HTMLElement;
  resultEl: HTMLElement;
  resetEl: HTMLElement;
  // jankenItems: Array<{id: string, text: string}>;
  jankenItems: any;
  resultItems: Array<{text: string}>;
  opponentText: String;
  gamePlaying: Boolean;
  opponentSelect: number;
  myselfSelect: number;
  constructor() {
    this.opponentEl = document.querySelector('.opponent');
    this.myselfEl = document.querySelector('.myself');
    this.resultEl = document.querySelector('.result');
    this.resetEl = document.querySelector('.reset');
    this.jankenItems = [
      {id: 'guu', text: 'グー'},
      {id: 'choki', text: 'チョキ'},
      {id: 'paa', text: 'パー'},
    ];
    this.resultItems = [
      {text: 'かち！'},
      {text: 'まけ。。'},
      {text: 'あいこ'},
    ];
    this.opponentText = 'ボタンを押してね';
    this.gamePlaying = false;
    this.opponentSelect = null;
    this.myselfSelect = null;
  }

  /**
   * 初期化
   */
  init(): void {
    this.initView();
    this.jankenHandler();
    this.resetHandler();
  }

  /**
   * 初期描画
   */
  initView(): void {
    this.myselfInitView();
    this.opponentInitView();
    this.resultInitView();
    this.resetInitView();
  }

  /**
   * じゃんけんの結果を取得
   * @param myself 自分の出した手の番号
   * @param opponent 相手の出した手の番号
   */
  getResult(myself: number, opponent: number): number {
    if(
      (myself === 0 && opponent === 1) ||
      (myself === 1 && opponent === 2) ||
      (myself === 2 && opponent === 0)
    ) {
      // 勝ち
      return 0;
    } else if(
      (myself === 0 && opponent === 2) ||
      (myself === 1 && opponent === 0) ||
      (myself === 2 && opponent === 1)
    ) {
      // 負け
      return 1;
    } else if(
      (myself === 0 && opponent === 0) ||
      (myself === 1 && opponent === 1) ||
      (myself === 2 && opponent === 2)
    ) {
      // あいこ
      return 2;
    } else {
      // その他の場合はエラー
      console.log('error');
      return null;
    }
  }

  /**
   * 自分の初期描画
   */
  myselfInitView(): void {
    let itemsHtml = '';
    for(let i = 0; i < this.jankenItems.length; i++) {
      itemsHtml += `
        <li class="column" data-index="${i}">
          <p class="myself__btn">
            <img class="myself__img" src="./img/${this.jankenItems[i].id}.png" alt="${this.jankenItems[i].text}">
          </p>
        </li>
      `;
    }
    const markup = `
      <ul class="myself__btns columns has-text-centered">
        ${itemsHtml}
      </ul>
    `;
    this.myselfEl.innerHTML = markup;
  }

  /**
   * 自分の手の表示
   * @param index 自分の手の番号
   */
  myselfShow(index): void {
    const btnEls = this.myselfEl.querySelectorAll('p');
    Array.from(btnEls)[index].classList.add('is-selected');
  }

  /**
   * 相手の初期描画
   */
  opponentInitView(): void {
    const markup = `
      <p class="is-size-4">${this.opponentText}</p>
    `;
    this.opponentEl.innerHTML = markup;
  }

  /**
   * 相手の手の表示
   * @param index 相手の手の番号
   */
  opponentShow(index: number): void {
    const markup = `
      <img class="opponent__img" src="./img/${this.jankenItems[index].id}.png" alt="">
    `;
    this.opponentEl.innerHTML = markup;
  }

  /**
   * 結果の初期描画
   */
  resultInitView(): void {
    this.resultEl.classList.add('is-hidden');
    this.resultEl.querySelector('p').textContent = '';
  }

  /**
   * 結果の表示
   * @param index 結果の番号
   */
  resultShow(index: number): void {
    this.resultEl.querySelector('p').textContent = this.resultItems[index].text;
    this.resultEl.classList.remove('is-hidden');
  }

  /**
   * リセットの初期描画
   */
  resetInitView(): void {
    this.resetEl.classList.add('is-hidden');
  }

  /**
   * リセットの表示
   */
  resetShow(): void {
    this.resetEl.classList.remove('is-hidden');
  }

  /**
   * じゃんけんボタンクリック時のイベント設定
   */
  jankenHandler(): void {
    this.myselfEl.addEventListener('click', e => {
      if (!this.gamePlaying) {
        const target = <HTMLElement>e.target;
        // 1.クリックしたボタンの番号を取得
        const targetBtn = <HTMLLIElement>target.closest('.column');
        const btnIndex = Number(targetBtn.dataset.index);
        // 2.自分の選択状態の変更
        this.myselfSelect = btnIndex;
        // 3.相手の選択状態の変更（ランダムに決定）
        this.opponentSelect = Math.floor(Math.random() * 3);
        // 4.「自分」部分の選択ボタンスタイル変更
        this.myselfShow(this.myselfSelect);
        // 5.「相手」部分の描画
        this.opponentShow(this.opponentSelect);
        // 6.「結果」の判定
        const resultIndex = this.getResult(this.myselfSelect, this.opponentSelect);
        // 7.「結果」部分の描画
        this.resultShow(resultIndex);
        // 8.「リセット」部分の描画
        this.resetShow();
        // 9.ゲーム状態の変更
        this.gamePlaying = true;
      }
    });
  }

  /**
   * リセットボタンクリック時のイベント設定
   */
  resetHandler(): void {
    this.resetEl.addEventListener('click', () => {
      this.initView();
      this.gamePlaying = false;
      this.opponentSelect = null;
      this.myselfSelect = null;
    });
  }
}
