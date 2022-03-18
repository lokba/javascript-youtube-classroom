import StorageEngine from '../domain/storageEngine';
import { $ } from '../util/domHelper';
import notFoundImage from '../../assets/images/not_found.jpg';

//template
const getVideoItemTemplate = ({ thumbnails, channelTitle, publishTime, title, videoId }) => `
  <li class="video-item" data-video-id=${videoId}>
    <div id="image-wrapper">
      <img
        src=${thumbnails} 
        alt="video-item-thumbnail" class="video-item__thumbnail">
    </div>
    <h4 class="video-item__title">${title}</h4>
    <p class="video-item__channel-name">${channelTitle}</p>
    <p class="video-item__published-date">${publishTime}</p>
    <div class="button-list">
      <button class="video-item__watch_button button">✅</button>
      <button class="video-item__delete_button button">🗑</button>
    </div>
  </li>`;

//class
export default class WatchVideoScreen {
  #watchLaterTabMenuButton = $('#watch-later-tab-menu-button');
  #watchedTabMenuButton = $('#watched-tab-menu-button');
  #watchLaterContainer = $('.watch-later-container');
  #watchedContainer = $('.watched-container');
  #watchLaterVideoList = $('.watch-later-video-list');
  #watchedVideoList = $('.watched-video-list');
  #storageEngine = new StorageEngine();

  constructor() {
    this.#watchLaterTabMenuButton.addEventListener('click', this.handleTabMenu);
    this.#watchedTabMenuButton.addEventListener('click', this.handleTabMenu);

    this.renderVideoList();
  }

  handleTabMenu = (e) => {
    const tabMenu = e.target.id === 'watch-later-tab-menu-button' ? 'watch-later' : 'watched';

    if (tabMenu === this.#storageEngine.getTabMenu()) return;

    this.#storageEngine.setTabMenu(tabMenu);
    this.toggleTabMenuClassName();
    this.renderVideoList();
  };

  toggleTabMenuClassName() {
    this.#watchLaterTabMenuButton.classList.toggle('clicked');
    this.#watchedTabMenuButton.classList.toggle('clicked');
    this.#watchLaterContainer.classList.toggle('hide');
    this.#watchedContainer.classList.toggle('hide');
  }

  renderVideoList() {
    this.#watchLaterVideoList.replaceChildren();
    const tabMenu = this.#storageEngine.getTabMenu();
    if (tabMenu === 'watch-later') {
      const watchLaterVideoList = this.#storageEngine.getWatchLaterVideos();

      this.#watchLaterVideoList.insertAdjacentHTML(
        'beforeend',
        watchLaterVideoList.map((video) => getVideoItemTemplate(video)).join('')
      );
      return;
    }
    const watchedVideoList = this.#storageEngine.getWatchedVideos();
    this.#watchedVideoList.insertAdjacentHTML(
      'beforeend',
      watchedVideoList.map((video) => getVideoItemTemplate(video)).join('')
    );
  }
}
