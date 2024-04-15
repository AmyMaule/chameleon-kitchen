const Intro = () => {
  return (
    <div className="intro-container">
      <div className="intro-text-container">
        <h3 className="intro-title">Your kitchen companion for seamless recipe conversions!</h3>
        <p className="intro-text">
          Say goodbye to kitchen measurement confusion as Chameleon Kitchen effortlessly converts recipes from cups to grams and everything in between.
          No need for manual line-by-line conversion calculations - let Chameleon Kitchen do the work for you.
          Simply paste any recipe into the box to convert it into your preferred units.
        </p>
      </div>
      <div className="intro-img-container">
        <div className="intro-img-text">
          Measure by <span className="intro-text-green">volume</span>...
        </div>
        <img className="intro-img" src="/intro-img.png" alt="Chameleons showing conversion" />
        <div className="intro-img-text">
          ...or by <span className="intro-text-blue">weight</span>!
        </div>
      </div>
    </div>
  )
}

export default Intro;
