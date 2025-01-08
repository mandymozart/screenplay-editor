import fullParse from "../../lib/fullParse.js";

export default (req, res) => {
  // temporary fix
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  console.log(req)
  try {
    const screenplay = fullParse('de');

    if (screenplay) {
      res.status(200).json(screenplay);
    } else {
      res.status(404).json({ error: 'Screenplay not found' });
    }
  } catch (error) {
    console.error('Error parsing screenplay:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
