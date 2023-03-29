# Instaclone Frontend

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

- []

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
