## Online player
> A simple H5 online payer for Movie.stu.nchu.edu.cn
  
### How to use

* `cd path/to/repo`
* run `npm i`
* run `npm start`
  
* Demo
![alt](docs/demo.png)

### ABC
* Front
1. Get user's URL
2. Decode URL to get MovieID
3. Post the MovieID to backstage
4. Get the return data & change player's src to it
* Backstage
1. Get post data
2. Decode
3. Query database
4. Return query result