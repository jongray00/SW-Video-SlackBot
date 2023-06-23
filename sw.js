// Use room name to create a video conference
const axios = require("axios");
const CreateRoom = async  (room) => {
    const axios = require('axios');
    const url = 'https://'+ SignalWireSPACE + '/api/video/conferences'
    const auth = 'Basic '+ SignalWireBASE64
    let data = JSON.stringify({
        "name": room,
    });
    let config = {
        method: 'post',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': auth,
        },
        data : data
    };

    axios(config)
        .then((response) => {
            console.log('This is response data');
            console.log(JSON.stringify(response.data));
            // console.log("Is this the ID?" + response.data.id)
        })
        .catch((error) => {
            console.log(error);
        });
}

// extract conference id

// Use list conferences api to find conference token
