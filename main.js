

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'QN'

const player = $('.player');
const cd = $('.cd')
const heading = $('header h2')
const cdThumd = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isReapeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Thê lương',
            sigger: 'Phúc Chinh',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Độ tộc 2',
            sigger: 'Mixi gaming',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Có hẹn với thanh xuân',
            sigger: 'MONSTART',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Níu duyên',
            sigger: 'Lê Bảo Bình',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Đừng chờ anh nữa',
            sigger: 'Tăng Phúc',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'Thức giấc',
            sigger: 'Dalab',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Sài gòn đau lòng quá',
            sigger: 'Hứa Kim Tuyền',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'Song 8',
            sigger: 'name 8',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            name: 'Song 9',
            sigger: 'name 9',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg'
        },
        {
            name: 'Muộn rồi mà sao còn',
            sigger: 'MTP',
            path: './assets/music/song10.mp3',
            image: './assets/img/song10.jpg'
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function () {
        const htmls = this.songs.map( (song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                <div class="thumb" 
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.sigger}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get:function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function () {
        const _this = this;        
        const cdWidth = cd.offsetWidth

        // Xử lý cd quay / dừng
        const cdThumbAnimate = cdThumd.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            interation: Infinity
        })
        cdThumbAnimate.pause();

        //Xử lý phóng to / thu nhỏ
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newWidth = cdWidth - scrollTop


            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0
            cd.style.opacity = newWidth / cdWidth
        }

        //Xử lý khi click play 
        playBtn.onclick = function () {
            if(_this.isPlaying){
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Khi song được play 
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //  Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua song
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime 
        }
        
      
        // Khi next song
        nextBtn.onclick  = function () {
            if(_this.isRandom) {
                _this.playRandomSong()
            }else {
                _this.nextSong()
            }  
            audio.play() 
            _this.render()    
            _this.scrollActiveSong() 
        }

        //  Khi prev song
        prevBtn.onclick = function () {
            if(_this.isRandom) {
                _this.playRandomSong()
            }else {
                _this.prevSong()
            }   
            audio.play()  
        }

        // Xử lý bật / tắt random song
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }   

        // Xử lý lặp lại 1 song
        repeatBtn.onclick = function (e) {
            _this.isReapeat = !_this.isReapeat
            _this.setConfig('isReapeat', _this.isReapeat)
            repeatBtn.classList.toggle('active', _this.isReapeat)
        }


        // Xử lý next song sau khi audio ended
        audio.onended = function() {
            if(_this.isReapeat) {
                audio.play()
            } else {
                repeatBtn.click()
            }
        }

        // Lắng nghe hành vi click playlist 
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            // Xử lý khi click vào song
            if(songNode || e.target.closest('.option')) {                
                // Xử lý khi click vào song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrenSong()                
                    _this.render()
                    audio.play()
                }
            }
        }
    },
    loadCurrenSong: function () {
       
        heading.textContent = this.currentSong.name
        cdThumd.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function() {
            this.isRandom = this.config.isRandom
            this.isReapeat = this.config.isReapeat
    },
    nextSong: function () {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrenSong()
    },
    prevSong: function () {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrenSong()
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrenSong()
    },
    scrollActiveSong: function () {
        setTimeout( () => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 300)
    },
    start: function () {
        // Gán cấu hình từ config ra vào ứng dụng
        this.loadConfig()

        //Định nghĩa các thuộc tính cho object
        this.defineProperties()

        //Lắng nghe /xử lý các sự kiện trong DOM events
        this.handleEvent()

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng 
        this.loadCurrenSong()

        //Render Playlist
        this.render()

        //Hiển thị trạng thái ban đầu của button repeat
        randomBtn.classList.toggle('active', this.isRandom)
        randomBtn.classList.toggle('active', this.isReapeat)
    } 
}
app.start();

