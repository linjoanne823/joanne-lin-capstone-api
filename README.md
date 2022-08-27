# FoodieGram
> FoodieGram finds you the best recipes that fits your dietary restrictions and preferred cuisines. If you are not in the mood to cook, no worries! We will find you restaurants near you that suit your taste. 
> Live demo [http://foodiegram.joannelin.ca]

## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Setup](#setup)
* [Project Status](#project-status)




## General Information
### What problem does it (intend to) solve?

Users spend a lot of time browsing different websites looking for the right recipes and restaurants. More often than not, users have to re-enter their dietary restrictions every time they look up what to cook/where to dine.

### What is the purpose of your project?

The end users are people who don't have the time to browse through the internet to look for recipes and restaurants, specifically those with dietary restrictions. Users will use this application to save their dietary restrictions so that they will only see recipes and restaurants that accomodate their needs.



## Technologies Used
- Relational Database: MySQL 
- ORM - Prisma
- Node.js
- Express.js 
- Passport.js 


## Features
- Stores User Data when User signs up with dietary info 
- Stores user's favourite recipes and restaurants 
- Updates user favourites accordingly using DELETE and POST 
- Fetches recipe data from Spoonacular API 
- Fetches YELP restaurant data using GraphyQL query


## Setup
- Prisma > .env - Here you will enter the Database URL to connect to the database in Prisma https://www.prisma.io/ format. 
- To set up the database, go to the schema-prisma file under the prisma folder. 
- For migrations, you can use the `db-setup` command




## Project Status
Project is: _in progress_ 




