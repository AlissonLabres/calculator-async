# Calculator Async

This project was generated with **Angular Express** and **.Net**

## Dependencies to start application
#### Docker
_Mac_\
`https://docs.docker.com/desktop/install/mac-install/`

_Windows_\
`https://docs.docker.com/desktop/install/windows-install/`

_Linux_\
`https://docs.docker.com/desktop/install/linux-install/`

#### C#
Install .NET\
https://dotnet.microsoft.com/pt-br/download

#### NodeJS
Install NodeJS\
https://nodejs.org/en

#### Angular
Install Angular\
https://angular.io/guide/setup-local#install-the-angular-cli


## Development server
#### Docker
Run _`docker compose up -d`_

#### C#
Access  _`cd calculator-worker`_\
Run `dotnet watch` for a dev server.\
The application will automatically reload if you change any of the source files.

#### NodeJS
Access  _`cd calculator-api`_\
Run `npm start` for a dev server.\
The application will automatically reload if you change any of the source files.

#### Angular
Access  _`cd calculator`_\
Run `npm start` for a dev server.\
Navigate to `http://localhost:4200/`.\
The application will automatically reload if you change any of the source files.

## Checklist
    - [x] Create Project Dotnet
        - [x] Plug-in RabbitMQ
        - [x] Plug-in MongoDB
        - [x] Configuration Queue
        - [x] Create Feature SEND
            - [x] Listening Queue
            - [x] Process Calculator
            - [x] Update Database
        - [ ] Create Singleton 
            - [ ] Singleton RabbitMQ
            - [ ] Singleton Database
        - [ ] Transforme to DIP (Dependency Inversion Principal)
            - [ ] Create Interfaces (Adapters)
            - [ ] Implement Interfaces
        - [ ] Implement Clean Architecture
            - [ ] Create Domain (Entity - Value Object)
            - [ ] Create Usecases
            - [ ] Connect Interface Adapter
    - [x] Create Project Nodejs Typescript
        - [x] Plug-in RabbitMQ
        - [x] Plug-in MongoDB
        - [x] Configuration Queue
        - [x] Create Feature SEND
            - [x] Send message to Queue
            - [x] Update Database
        - [x] Create Feature GET
            - [x] Get Database
        - [x] Create Singleton 
            - [x] Singleton Database
            - [x] Singleton RabbitMQ
        - [ ] Transforme to DIP (Dependency Inversion Principal)
            - [ ] Create Interfaces (Adapters)
            - [ ] Implement Interfaces
        - [ ] Implement Clean Architecture
            - [ ] Create Domain (Entity - Value Object)
            - [ ] Create Usecases
            - [ ] Connect Interface Adapter
    - [x] Create Project Angular
        - [x] Plug-in Service
        - [x] Configuration Service
        - [x] Create Feature SEND
            - [x] Create fields HTML
            - [x] Create Directive
                - [x] Implement to field accept only number
            - [x] Send information to Service
        - [x] Create Feature GET
            - [x] List fields HTML 
            - [x] Get information to Service
        - [ ] Transforme to DIP (Dependency Inversion Principal)
            - [ ] Create Interfaces (Adapters)
            - [ ] Implement Interfaces
        - [ ] Implement Clean Architecture
            - [ ] Create Domain (Entity - Value Object)
            - [ ] Create Usecases
            - [ ] Connect Interface Adapter