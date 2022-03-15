import SearchEngine from '../domain/searchEngine.js';
import StorageEngine from '../domain/storageEngine.js';

import { $, $$ } from '../util/domHelper.js';
import { NO_RESULT_IMAGE_TEMPLATE, SKELETON_TEMPLATE } from '../util/template.js';
import { preprocessDate } from '../util/common.js';
import { DELAY_MILISECOND_TIME, VIDEO_COUNT } from '../util/constants.js';

export default class ScreenManager {
  #throttle;

  constructor() {
    // 인스턴스 생성
    this.searchEngine = new SearchEngine();
    this.storageEngine = new StorageEngine();

    // element 초기화
    this.searchModalButton = $('#search-modal-button');
    this.modalContainer = $('.modal-container');
    this.searchButton = $('#search-button');
    this.searchInputKeyword = $('#search-input-keyword');
    this.searchResult = $('.search-result');
    this.noResult = $('.no-result');
    this.videoList = $('.video-list');

    //초기 화면 렌더링
    this.noResult.insertAdjacentHTML('beforeend', NO_RESULT_IMAGE_TEMPLATE);

    // 이벤트 핸들러 등록
    this.searchModalButton.addEventListener('click', this.handleOpenModal.bind(this));
    document.addEventListener('click', this.handleCloseModal.bind(this));
    this.searchButton.addEventListener('click', this.handleSearchVideos.bind(this));
    this.searchInputKeyword.addEventListener('keypress', this.handleSearchVideos.bind(this));
    this.searchResult.addEventListener('click', this.handleSaveVideo.bind(this));
  }

  handleOpenModal() {
    this.modalContainer.classList.remove('hide');
  }

  handleCloseModal(e) {
    if (e.target.matches('#search-modal-button')) return;

    if (!e.target.closest('.search-modal')) {
      this.modalContainer.classList.add('hide');
    }
  }

  async handleSearchVideos(e) {
    if (e.key === 'Enter' || e.type === 'click') {
      this.initSearchEnvironment();
      this.renderSkeleton();
      const keyword = this.searchInputKeyword.value;

      try {
        const data = await this.searchEngine.searchKeyword(keyword);
        this.renderSearchResult(data);
      } catch (error) {
        alert(error);
      }
    }
  }

  initSearchEnvironment() {
    this.searchResult.classList.remove('search-result--no-result');
    this.noResult.classList.add('hide');
    this.videoList.replaceChildren('');
    this.searchEngine.resetPageToken();
  }

  renderSkeleton() {
    this.videoList.insertAdjacentHTML('beforeend', SKELETON_TEMPLATE);
  }

  renderSearchResult(data) {
    if (data === null) {
      this.searchResult.classList.add('search-result--no-result');
      this.noResult.classList.remove('hide');
      this.videoList.replaceChildren('');

      return;
    }

    const preprocessedData = ScreenManager.preprocessData(data);
    this.allocatePreprocessedData(preprocessedData);
    this.bindScrollEvent();
  }

  static preprocessData(data) {
    return data.map((datum) => {
      const thumbnails = datum.snippet.thumbnails.high.url;
      const { title, channelTitle, publishTime } = datum.snippet;
      const { videoId } = datum.id;

      return {
        thumbnails,
        title,
        channelTitle,
        publishTime: preprocessDate(publishTime),
        videoId,
      };
    });
  }

  allocatePreprocessedData(preprocessedData) {
    const skeletonList = $$('.skeleton');

    for (let i = 0; i < preprocessedData.length; i++) {
      const element = skeletonList[i];
      const { videoId, channelTitle, thumbnails, title, publishTime } = preprocessedData[i];

      element.dataset.videoId = videoId;
      $('.video-item__thumbnail', element).src = thumbnails;
      $('.video-item__title', element).textContent = title;
      $('.video-item__channel-name', element).textContent = channelTitle;
      $('.video-item__published-date', element).textContent = publishTime;

      if (this.storageEngine.isSavedVideo(videoId)) {
        $('.video-item__save-button', element).classList.add('hide');
      }

      element.classList.remove('skeleton');
    }

    const remainedSkeletonCount = VIDEO_COUNT - preprocessedData.length;

    for (let i = 0; i < remainedSkeletonCount; i++) {
      this.videoList.removeChild(this.videoList.lastElementChild);
    }

    if (this.searchEngine.pageToken === null) {
      this.videoList.removeEventListener('scroll', this.handleScroll);
      //TODO : 스낵바로 "더 이상의 검색결과는 존재하지 않습니다."
    }
  }

  bindScrollEvent() {
    this.videoList.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = async (e) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;

    if (!this.#throttle && scrollTop + clientHeight >= scrollHeight) {
      this.#throttle = setTimeout(async () => {
        if (this.searchEngine.pageToken !== null) {
          this.renderSkeleton();
        }

        this.#throttle = null;
        const keyword = this.searchInputKeyword.value;

        try {
          const data = await this.searchEngine.searchKeyword(keyword);
          this.renderAdditionalVideos(data);
        } catch (error) {
          alert(error);
        }
      }, DELAY_MILISECOND_TIME);
    }
  };

  renderAdditionalVideos(data) {
    if (data === null) {
      this.videoList.replaceChildren('');
      return;
    }

    const preprocessedData = ScreenManager.preprocessData(data);
    this.allocatePreprocessedData(preprocessedData);
  }

  handleSaveVideo(e) {
    if (e.target.classList.contains('video-item__save-button')) {
      const { videoId } = e.target.closest('.video-item').dataset;

      this.storageEngine.saveVideo(videoId);
      e.target.classList.add('hide');
    }
  }
}
