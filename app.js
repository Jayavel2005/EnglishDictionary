async function generateWord (){
  const inputWord = document.querySelector(".word-input").value || 'hello';

  if (!inputWord) {
    alert("Enter a word to search");
    return;
  }

  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${inputWord}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Word not found");

    const data = await response.json();
    const word = data[0]?.word || "N/A";
    const phonetic = data[0]?.phonetic || "N/A";
    const audio = data[0]?.phonetics[0]?.audio || null;

    // Word section
    let html = `
      <div class="row px-2 py-3 shadow rounded border">
        <div class="col-lg-10">
          <p class="fs-4 m-0">Word:</p>
          <p class="mb-2">${word} <span class="text-muted">(${phonetic})</span></p>
        </div>
        <div class="col-lg-2 my-1">
          ${
            audio
              ? `<button class="btn btn-primary w-100 play-audio" data-audio="${audio}">
                   <i class="fa-solid fa-volume-high" style="color: #ffffff;"></i>
                 </button>`
              : ""
          }
        </div>
      </div>
    `;

    // Parts of speech section
    data[0]?.meanings.forEach((meaning) => {
      const partOfSpeech = meaning.partOfSpeech || "N/A";
      const definition =
        meaning.definitions[0]?.definition || "No definition available";
      const example =
        meaning.definitions[0]?.example || "No example available";

      html += `
        <div class="col-12 my-2 shadow p-3 rounded border">
          <p class="fs-5">Parts Of Speech: <span class="badge bg-danger">${partOfSpeech}</span></p>
          <p><span class="badge bg-success fs-6">Definition:</span> ${definition}</p>
          <p><span class="badge bg-primary fs-6">Example:</span> ${example}</p>
        </div>
      `;
    });

    // Update the HTML
    document.querySelector(".word-input").value = " ";
    document.querySelector(".col-lg-7").innerHTML = html;

    // Add event listener for the play button
    if (audio) {
      document.querySelector(".play-audio").addEventListener("click", () => {
        const audioPlayer = new Audio(audio);
        audioPlayer.play();
      });
    }
  } catch (error) {
    alert(error.message);
  }
};

generateWord();