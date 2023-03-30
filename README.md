# Instaclone Frontend

- 웹 유저 => 페이지 업데이트: 새로고침
- 모바일 유저 => 페이지 업데이트: 새로고침이 웹에 비해 힘듬, cache가 중요해짐
- and 변경사항이 생기면 앱 모든 곳에서 즉시 반영되기를 바라는 경향이 있음

- [주로 배운 것]
- React Hook Form
- Styled-Components (extend 하는 법, props 주고 받기, themes 다루기, 다크 모드 만들기)
- Apollo Cache (Redux를 대체할 수 있음, 동일한 객체들을 똑같은 캐쉬 주소에 저장해 놓음
- => 객체 하나가 바뀔 때 동일한 객체들 모두 다시 렌더링 해주기 때문에 매우 편리함)
- Reactive Variable

- styled-components: CSS
- (스타일을 styles.css 파일에 만들 수 있음, 그러나 dark mode 같은 것을 할 때
- 즉, components가 react.js props에 따라서 바뀌기를 원할 때 발생
- styled-components는 props를 보내거나 받음)
- react hook form: form
- react router
- apollo client: GraphQL에 접근하기 위함
- react helmet: React app 타이틀을 동적으로 변화시켜줌
- react-fontawesome
- => (npm i --save @fortawesome/fontawesome-svg-core
- npm install --save @fortawesome/free-solid-svg-icons
- npm install --save @fortawesome/react-fontawesome
- npm install --save @fortawesome/free-brands-svg-icons
- npm install --save @fortawesome/free-regular-svg-icons),
- npm install styled-reset(스타일 전체 초기화)

# Frontend Setup

- [✔] Router
- [✔] Authentication
- [✔] Architecture
- [✔] Styles
- [✔] Log In / Sign Up
- [✔] Feed
- [✔] Profile

# Sanitize HTML

<pre><code>
dangerouslySetInnerHTML={{
    __html: cleanedPayload,
}}

const cleanedPayload = sanitizeHtml(payload.replace(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g, "<mark>$&</mark>"), {
        allowedTags: ["mark"],
});
</code></pre>

- reactjs component를 넣을 수 없음

# Arch. Comments

- feed의 photo는 id를 가지고 있음
- 댓글 부분에는 Comments라는 component가 있음
- Comments component는 photo의 id를 받을 것임
- Comments component는 Comment로 photo의 id를 보낼 것임

# Profile

- seeProfile시 cache에 따로 저장이 되지 않는 이유: root query에 저장되어 있기 때문
- id가 없으면 Apollo는 user를 찾지 못함
- Apollo는 query에서 id를 요청하면 id가 unique 항목인 것을 알고 있음

- Apollo는 cache에 새로운 user를 생성하지 않고, 기존 user를 확장시킴
- Apollo에게 id를 주면, 요청하는 특정부분 id와 cache에 저장되어 있는
- id가 일치할 경우, Apollo는 두 가지를 섞어 확장시킴
- 분리 시키기 위해서는 Apollo Cache의 dataIdFromObject를 사용

# Follow Unfollow

- Cache를 업데이트 하는 두 가지 방법
- modify와 write fragment
- 간접적인 방법: Query를 refetch하는 것: Mutation이 완료되었을 때,
- backend와 통신해서 Query를 다시 받아온 후, 그 query를 재사용할 수 있음
