function plugin(){
    return {
        hasPropertyThenOr: (g1,g2,g3)=>{
            return has_property(g1,g2)?get_property(g1,g2):g3
        }
    }
}