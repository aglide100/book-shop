create table if not exists "Member"
(
    member_no   varchar not null
        constraint member_pk
            primary key,
    password    varchar not null,
    name        varchar not null,
    recommender varchar
        constraint " recommender"
            references "Member"
            on update cascade on delete cascade,
    point       integer
);

comment on table "Member" is '회원';

alter table "Member"
    owner to table_admin;

create unique index if not exists member_member_no_uindex
    on "Member" (member_no);

create table if not exists "Address"
(
    zipcode   varchar(10),
    address1  varchar,
    address2  varchar,
    member_no varchar
        constraint member_no
            references "Member"
            on update cascade on delete cascade
);

comment on table "Address" is '배송지';

alter table "Address"
    owner to table_admin;

create table if not exists "Order"
(
    order_no          varchar not null
        constraint order_pk
            primary key,
    order_date        date    not null,
    price             integer not null,
    member_no         varchar
        constraint member_no
            references "Member"
            on update cascade,
    credit_number     varchar not null,
    credit_kind       varchar not null,
    credit_expiredate varchar not null,
    address_zipcode   varchar not null,
    address_address1  varchar not null,
    address_address2  varchar
);

comment on table "Order" is '주문';

alter table "Order"
    owner to table_admin;

create unique index if not exists order_order_no_uindex
    on "Order" (order_no);

create table if not exists "Book"
(
    book_no  varchar not null
        constraint book_pk
            primary key,
    title    varchar not null,
    author   varchar not null,
    quantity integer not null,
    price    integer not null
);

comment on table "Book" is '도서';

alter table "Book"
    owner to table_admin;

create unique index if not exists book_book_no_uindex
    on "Book" (book_no);

create table if not exists "Cart"
(
    cart_no     varchar not null
        constraint cart_pk
            primary key,
    create_date varchar not null,
    member_no   varchar
        constraint member_no
            references "Member"
            on update cascade on delete cascade
);

comment on table "Cart" is '장바구니';

alter table "Cart"
    owner to table_admin;

create unique index if not exists cart_cart_no_uindex
    on "Cart" (cart_no);

create table if not exists "CreditCard"
(
    card_number integer not null
        constraint creditcard_pk
            primary key,
    expire_date date    not null,
    kind        varchar not null,
    cvc         integer not null,
    member_no   varchar
        constraint member_no
            references "Member"
            on update cascade on delete cascade
);

comment on table "CreditCard" is '신용카드';

alter table "CreditCard"
    owner to table_admin;

create unique index if not exists creditcard_card_number_uindex
    on "CreditCard" (card_number);

create table if not exists "Cart_Book"
(
    book_no       varchar not null,
    cart_no       varchar not null,
    cart_quantity integer,
    cart_price    integer not null
);

alter table "Cart_Book"
    owner to table_admin;

create table if not exists "Order_detail"
(
    order_no       varchar,
    book_no        varchar,
    order_quantity integer not null,
    order_price    integer not null
);

alter table "Order_detail"
    owner to table_admin;

