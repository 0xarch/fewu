function plugin(){
    return {
        hasPropertyThenOr: (g1,g2,g3)=>{
            return GObject.hasProperty(g1,g2)?GObject.getProperty(g1,g2):g3
        }
    }
}