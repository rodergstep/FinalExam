// SLIDER
var sliderOptions1 = {
    sliderId: "slider1",
    effect: "12",
};
var imageSlider1 = new mcImgSlider(sliderOptions1);

var sliderOptions2 = {
    sliderId: "slider2",
    effect: "12",
};
var imageSlider2 = new mcImgSlider(sliderOptions2);

var sliderOptions3 = {
    sliderId: "slider3",
    effect: "12",
};
var imageSlider3 = new mcImgSlider(sliderOptions3);

// MASONRY
masonryRender(Masonry);

function masonryRender() {
    var msnry = document.querySelector('.grid');
    var masonryOptions = new Masonry(msnry, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        gutter: 19,
        percentPosition: true
    });

    var items = document.getElementsByClassName("grid-item");
    for (var i = 0; i < items.length; i++) {
        items[i].innerHTML = '<div><a></a></div>';
    }


    document.getElementById("searchbtn__value").addEventListener("click", function() {
        var inputValue = document.getElementById("searchinput__value").value;
        xhr(inputValue);
        document.getElementById("searchinput__value").value = "";
    });

    document.getElementById("searchinput__value").addEventListener("keyup", function(e) {
        if (e.keyCode == 13) {
            var inputValue = document.getElementById("searchinput__value").value;
            xhr(inputValue);
            document.getElementById("searchinput__value").value = "";
        }
    });

    function resetImg(data) {
        var items = document.getElementsByClassName("grid-item");

        for (var i = 0; i < data.hits.length; i++) {

            items[i].style.background = "url('" + data.hits[i].webformatURL + "') no-repeat center center";
            items[i].style.backgroundSize = "cover";

            items[i].childNodes[0].childNodes[0].innerHTML = data.hits[i].tags;
            items[i].childNodes[0].childNodes[0].style.top = (items[i].offsetHeight - items[i].childNodes[0].childNodes[0].offsetHeight) / 2 + "px";
        }

    }

    xhr("architecture");

    function xhr(inputValue) {
        var request;
        var url = "https://pixabay.com/api/?key=2736831-b44f771913afeabeecf3e334d&image_type=photo&pretty=true&per_page=7&orientation=horizontal&q=" + inputValue;

        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        } else {
            // IE fallback
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }
        request.onreadystatechange = function(data) {
            if (this.readyState == 4 && this.status == 200) {
                data = JSON.parse(this.responseText);
                resetImg(data);
            }
        };
        request.open("GET", url, true);
        request.send();
    }

    window.addEventListener("resize", function() {
        var items = document.getElementsByClassName("grid-item");
        for (var i = 0; i < items.length; i++) {
            items[i].childNodes[0].childNodes[0].style.top = (items[i].offsetHeight - items[i].childNodes[0].childNodes[0].offsetHeight) / 2 + "px";
        }
    });

}
