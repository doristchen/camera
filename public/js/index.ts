/* global requestAnimationFrame, fetch, URL */

const drawRect = (canvasCtx, dimensions) => {
  const {x, y, w, h} = dimensions
  canvasCtx.strokeRect(x, y, w, h)
}

const onSuccessMedia = (stream) => {
  const streamVideo = <HTMLVideoElement>document.querySelector('#stream')
  const feedCanvas = <HTMLCanvasElement>document.querySelector('#feed')
  const {width, height} = feedCanvas
  const feedContext = feedCanvas.getContext('2d')
  const videoSourceUrl = window.URL.createObjectURL(stream)

  document.querySelector('#trainButton').addEventListener('click', () => {
    const personIdInput = <HTMLInputElement>document.querySelector('#personId')
    const personId = personIdInput.value
    fetch('/train', {
      method: 'post',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({
        data: feedCanvas.toDataURL('image/png'),
        personId
      })
    }).then((res) => {
      return res.json()
    }).then((data) => {
      console.log(data)
    })
  })

  document.querySelector('#identifyButton').addEventListener('click', () => {
    fetch('/identify', {
      method: 'post',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({
        data: feedCanvas.toDataURL('image/png')
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
      })
  })
  console.log('videoSource', videoSourceUrl, width, height)
  streamVideo.autoplay = true
  streamVideo.src = videoSourceUrl

  feedContext.drawImage(streamVideo, 0, 0, width, height)

  const renderFeedCanvas = () => {
    feedContext.drawImage(streamVideo, 0, 0, width, height)
    // drawRect(feedContext, {x: 50, y: 50, w: 100, h: 100})
    requestAnimationFrame(renderFeedCanvas)
  }

  requestAnimationFrame(renderFeedCanvas)

  // setTimeout(() => {
  //   fetch('/submit', {
  //     method: 'post',
  //     headers: {
  //       'Content-type': 'application/json; charset=UTF-8'
  //     },
  //     body: JSON.stringify({
  //       data: feedCanvas.toDataURL('image/png')
  //     })
  //   }).then((res) => {
  //     return res.json()
  //   }).then((data) => {
  //     console.log(data)
  //   })
  // }, 3000)

  const feedImage = feedContext.getImageData(0, 0, width, height)
  console.log(feedImage)
}

navigator.getUserMedia({ 'video': true }, onSuccessMedia, () => { })

