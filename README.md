# 업비트 BTC 현재가 (Vercel + GitHub)

업비트 Open API(`GET /v1/ticker`)로 비트코인(KRW-BTC) 현재가를 보여주는 모바일 웹앱입니다.

```
브라우저 ──> /api/ticker (Vercel 서버리스 함수) ──> api.upbit.com/v1/ticker
```

- `public/index.html` : 모바일 화면 (정적 파일)
- `api/ticker.js` : 업비트 호출 프록시 (CORS 해결 + 2초 캐시)
- 시세 조회 API는 인증이 필요 없어 API Key/환경변수가 없습니다.

## 배포 방법
1. GitHub에서 새 저장소를 만들고 이 폴더를 push
   ```bash
   git init && git add . && git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/<내계정>/upbit-btc.git
   git push -u origin main
   ```
2. https://vercel.com/new 에서 **Import Git Repository** → 위 저장소 선택 → **Deploy**
   (Framework Preset: Other, 설정 변경 불필요)
3. 발급된 `https://<프로젝트>.vercel.app` 주소를 핸드폰에서 열고, 홈 화면에 추가하면 앱처럼 사용 가능
4. 이후 `git push` 할 때마다 자동으로 재배포됩니다.

## 로컬 테스트
```bash
npm i -g vercel
vercel dev
```

## 다른 코인 보기
`/api/ticker?market=KRW-ETH` 처럼 `market` 파라미터로 페어를 바꿀 수 있습니다.
