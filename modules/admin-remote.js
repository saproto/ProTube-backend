//change volumes, validation in api.js
exports.changeVolume = (type, volume) => {
    switch(type){
        case "radio":
          return apiVolumeSuccess(type, volume);
          break;
        case "master":
          return apiVolumeSuccess(type, volume);
          break;
        case "youtube":
          return apiVolumeSuccess(type, volume);
          break;
    }
}

function apiVolumeSuccess(type, new_volume){
    return {
      success: true,
      modified: type,
      new_volume: new_volume,
      message: 'Dummy message'
    };
  }