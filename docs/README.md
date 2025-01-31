### 기능 요구사항 목록🎯

- 유튜브 검색 조회 기능
  - [x] 유저가 보고 싶은 영상들을 검색할 수 있다.
    - [x] `유튜브 검색 API`를 사용한다. (도메인)
    - [x] 엔터키를 눌러 검색할 수 있다. (UI)
    - [x] 검색 버튼을 클릭해 검색할 수 있다. (UI)

<br>
  
- 유튜브 검색 렌더링 기능  
  - 검색 결과가 없는 경우
    - [x] 결과 없음 이미지를 보여준다. (UI)
    - [x] 해당 이미지는 `src/images/status/not_found.png` 경로에 있다. (UI)

- 검색 결과가 있는 경우
  - [x] 데이터를 불러오는 동안 현재 데이터를 불러오는 중임을 skeleton UI로 보여준다. (UI)
  - [x] 최초 검색 결과는 10개까지만 보여준다. (UI)
  - [x] 유저가 브라우저 스크롤 바를 끝까지 이동시켰을 경우, 그 다음 10개 아이템을 추가로 불러온다. (UI)
  - [x] 이미 저장된 영상이라면 저장 버튼이 보이지 않도록 한다. (UI)

<br>

- 유튜브 저장 기능

  - [x] 유저가 검색한 영상들의 json 데이터를 저장할 수 있다. (도메인)
  - [x] 영상 id를 Web Storage에 저장한다. (도메인)
  - [x] 저장 가능한 최대 동영상의 갯수는 100개이다. (도메인)

<br>

- 볼 영상 탭👁

  - [x] 볼 영상이 없을 경우, 비어있다는 것을 사용자에게 알려준다.
  - [x] 기본 메인 화면은 `볼 영상 탭`으로 유지한다.
  - [x] ✅ 버튼 클릭시, 해당 비디오는 `본 영상 탭`으로 이동한다.
  - [x] 🗑 버튼 클릭시, `볼 영상 탭`에서 삭제할 수 있다.
    - [x] 삭제 시 사용자에게 삭제 여부 메시지를 물어본다.

<br>

- 본 영상 탭✅

  - [x] 볼 영상이 없을 경우, 비어있다는 것을 사용자에게 알려준다.
  - [x] ✅ 버튼 클릭시, 해당 비디오는 `볼 영상 탭`으로 이동한다.
  - [x] 🗑 버튼 클릭시, `본 영상 탭`에서 삭제할 수 있다.
    - [x] 삭제 시 사용자에게 삭제 여부 메시지를 물어본다.

<br>

- 반응형 기능

  - 디바이스의 가로 길이에 따라 검색결과의 row 당 column의 갯수가 변경된다.
    - [x] 1280픽셀 이상 - 4개
    - [x] 960픽셀 이상 - 3개
    - [x] 600픽셀 이상 - 2개
    - [x] 600픽셀 미만 - 1개

---

### 테스트 요구사항 목록🎯

- [x] 핵심 플로우에 대한 E2E 테스트를 작성한다.
