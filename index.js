const { parse } = require('csv-parse');
// File system module is going to help us do what we need to do.
const fs = require('fs');

// creating an array which we'll call results and we'll make it a constant.
// we can update the contents by pushing values
const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}
// Our function takes in the name or path 
// to the file that we're opening 
// and that it gives us back a readable stream.
// read our file by passing in the name kepler_data.csv
fs.createReadStream('kepler_data.csv')
/**
 * The pipe function is meant to :
 * connect a readable stream source to a readable stream destination
 * a stream that takes in data as opposed to giving you data.
 * So the Kepler file is our source, 
 * and the parse function is the destination for our pipe.
 * */
  .pipe(parse({
    comment: '#', // So now we're telling it that we want to treat lines that start with this character # as comments 
    columns: true, // which is columns being set to true.
  }))
  // We can use these events to read our file in piece by piece, 
  // and every time a piece of data is received,
  // we can do some processing on that data while we wait for the rest of the data to be read it.

  .on('data', (data) => {
    if (isHabitablePlanet(data)) {
      habitablePlanets.push(data);
    }
  })
  // That is when we've reached, there was an error
  // Maybe our file doesn't exist.
  .on('error', (err) => {
    console.log(err);
  })
  // That is when we've reached the end of our file
  .on('end', () => {
    console.log(habitablePlanets.map((planet) => {
      return planet['kepler_name'];
    }));
    console.log(`${habitablePlanets.length} habitable planets found!`);
  });