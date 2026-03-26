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


    searchData 
     [
       "서울특별시",
       "서울특별시-종로구",
       "서울특별시-종로구-청운동",
       "서울특별시-종로구-신교동",
       "서울특별시-종로구-궁정동",
       "서울특별시-종로구-효자동",
       "서울특별시-종로구-창성동",
       "서울특별시-종로구-통의동",
       "서울특별시-종로구-적선동",
       "서울특별시-종로구-통인동",
       "서울특별시-종로구-누상동",
       "서울특별시-종로구-누하동",
       "서울특별시-종로구-옥인동",
       "서울특별시-종로구-체부동",
       "서울특별시-종로구-필운동",
       "서울특별시-종로구-내자동",
       "서울특별시-종로구-사직동",
       "서울특별시-종로구-도렴동",
       "서울특별시-종로구-당주동",
       "서울특별시-종로구-내수동",
       "서울특별시-종로구-세종로",
       "서울특별시-종로구-신문로1가",
       "서울특별시-종로구-신문로2가",
       "서울특별시-종로구-청진동",
       "서울특별시-종로구-서린동",
     ]
 

    import { useRef, useState } from "react";
    import WorkerTask from "@parksuhyun9321/worker-task";
    import searchData from "entities/workerTask/korea_districts.json"
    
    const WorkerTaskPageView = () => {
    
        const [arr, SetArr] = useState<string[] | null>([]);
    
        const debounceTimer = useRef<number | null>(null);
    
        const inputRef = useRef<HTMLInputElement>(null);
    
        const { PostMessage } = WorkerTask<POSTMESSAGE_PARAM, POSTMESSAGE_RESULT>(({ value, searchData : data }) => {
            function normalize(s: string) {
                return s.replace(/[^가-힣0-9]/g, "")
            }
    
            const result = data.filter(el => {
                const k = normalize(el);
                if (k.includes(value.replace(/\s+/g,""))) return el
            })
            
            return result
        })
    
        function OnInputCallback(e : React.InputEvent<HTMLInputElement>) {
            const value = e.currentTarget.value.trim();
    
            if (!value) return SetArr(null);
    
            if (debounceTimer["current"] !== null) {
                clearTimeout(debounceTimer["current"]);
                debounceTimer["current"] = null;
            }
    
            debounceTimer["current"] = setTimeout(async () => {
    
                if(!inputRef["current"]?.value) return SetArr(null);
                
                const result = await PostMessage({value, searchData});
    
                SetArr(result);
            }, 150);
        }
    
        return (
            <div className="text-center">
                <h1 className="mb-[30px] text-[1.8rem]">@parksuhyun9321/worker-task</h1>
    
                <div className="inline-block text-left">
                    <label className="block mb-[10px]" htmlFor="input">
                        주소 입력해보기
                    </label>
                    <input ref={inputRef} onInput={OnInputCallback} className="w-[300px] h-[35px] px-[10px] border-[1px] rounded-[6px] outline-none [&::placeholder]:text-[0.8rem]" id="input" type="text" placeholder="ex) 서울특별시 마포구 망원동" />
    
                    <ul className="max-h-[250px] min-h-[150px] mt-[15px] py-[5px] px-[10px] space-y-[10px] border-[1px] rounded-[8px] overflow-y-auto">
    
                        {
                            arr && arr?.length <= 0 ?
                                <li className="mt-[30px] text-center text-[gray] text-[0.9rem]">검색결과가 없습니다.</li>
                            :
                            arr?.map((el, i) => {
                                return (
                                    <li key={`${el}-${i}`}  className="
                                        flex
                                        items-center
                                        before:content-['']
                                        before:block
                                        before:w-[5px]
                                        before:h-[5px]
                                        before:mr-[5px]
                                        before:bg-[#000]
                                        before:rounded-[100%]
                                    ">{el}</li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
    
    export default WorkerTaskPageView
