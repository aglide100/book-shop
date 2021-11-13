# book-shop

## 1. 목적

---

이 프로젝트는 postgres와 webapp의 테스트 코드입니다!

react + nodejs로 구성을 하였으며 

react는 nextjs을 이용하여 static으로 export하여 사용하며

nodejs의 express로 정적파일을 라우팅을 하는 webd와 restFul한 api로 데이터를 제공하는 apid로 구성합니다.

## 2. 실행방법

---

> ./build&run.sh

을 실행하거나

docker을 사용하신다면

> docker-compose build

> docker-compose up -d

npm script는

> cd ui/

> npm run make

> cd ..

> npm run build & npm run start

입니다.

## 3. 의존성

---

본 레포는 기본적으로 typescript을 이용하며...

아래의 환경에서 테스트 하였으며 macos에서 테스트하였으며

docker버전은 아래와 같습니다.

```
Docker version 20.10.7, build f0df350

Client:
 Cloud integration: 1.0.17
 Version:           20.10.7
 API version:       1.41
 Go version:        go1.16.4
 Git commit:        f0df350
 Built:             Wed Jun  2 11:56:22 2021
 OS/Arch:           darwin/amd64
 Context:           default
 Experimental:      true

Server: Docker Engine - Community
 Engine:
  Version:          20.10.7
  API version:      1.41 (minimum version 1.12)
  Go version:       go1.13.15
  Git commit:       b0f5bc3
  Built:            Wed Jun  2 11:54:58 2021
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.4.6
  GitCommit:        d71fcd7d8303cbf684402823e425e9dd2e99285d
 runc:
  Version:          1.0.0-rc95
  GitCommit:        b9ee9c6314599f1b4a7f497e1f1f856fe433d3b7
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0
```

node의 버전은 아래와 같습니다.

```
node v16.8.0
```

