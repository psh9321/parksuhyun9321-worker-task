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
 - 별도의 워커 파일 없이 오래 걸리는 작업을 다른 스레드에서 실행할 수 있는 유틸리티
 - 워커 실행 후 리소스 정리를 위해 자동으로 종료
 - onmessage, onerror 결과값을 그대로 리턴 하기 위해 Promise로 리턴
 - WorkerTask 바인딩 시 첫 번째 타입에는 postMessage의 파라미터, 두 번째 타입에는 PostMessage 의 리턴 결과값을 지정

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