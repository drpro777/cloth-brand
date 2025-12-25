let slideIndex1 = 0;
const slides1 = document.querySelectorAll(".slide1");
const dots1 = document.querySelectorAll(".dot1");

function showSlide1(index) {
  slides1.forEach((slide, i) => {
    slide.classList.remove("active1", "exit-left");
    dots1[i].classList.remove("active1");

    if (i === slideIndex1) {
      slide.classList.add("exit-left");
    }
  });

  slides1[index].classList.add("active1");
  dots1[index].classList.add("active1");
  slideIndex1 = index;
}

function currentSlide1(index) {
  showSlide1(index);
}

function autoSlide1() {
  let nextIndex = (slideIndex1 + 1) % slides1.length;
  showSlide1(nextIndex);
}

setInterval(autoSlide1, 4000); // every 4 seconds


// show more function
