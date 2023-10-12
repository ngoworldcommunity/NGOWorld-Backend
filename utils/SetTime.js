const setTime = () => {
  const date = new Date();
  const hours = date.getHours().toString();
  const minutes = date.getMinutes().toString();
  const seconds = date.getSeconds().toString();

  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const currentTime = `${formattedHours}.${formattedMinutes}.${formattedSeconds}`;
  return currentTime;
};

module.exports = { setTime };
