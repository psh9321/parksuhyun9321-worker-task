# @parksuhyun9321/worker-task

## 설치 
 - npm install @parksuhyun9321/worker-task
 - pnpm add @parksuhyun9321/worker-task
 - yarn add @parksuhyun9321/worker-task

## 테스트 
 - pnpm test

## 빌드 
 - pnpm tsup

## 함수 기반 워커 유틸리티 
 - 별도의 워커 파일 없이 오래걸리는 작업을 다른스레드에서 실행할수 있는 유틸리티
 - 워커 실행후 리소스 정리 를 위해 자동으로 종료
 - onmessage, onerror 결과 값을 그대로 리턴 하기 위해 Promise 로 리턴
 - WorkerTask 바인딩 시 첫번째 타입에는 postMessage 의 파마리터, 두번째 타입에는 PostMessage 의 리턴 결과값을 지정

### example

 - 문자열 배열 필터링을 메인 스레드 UI 블로킹 없이 실행하고 싶을 시

    const { PostMessage } = WorkerTask<{value : string, data : string[]}, string[]>(({value, data}) => {

        const result = data.filter(keyword => {
            if (keyword.includes(value.replace(/\s+/g,""))) return keyword
        })

        return result
    })

    const result = await PostMessage({value, data});

    result : string[]