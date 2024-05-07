from dokkanfunctions import *
directory="data/"
cards=storedatabase(directory,"cards.csv")
card_awakening_routes=storedatabase(directory, "card_awakening_routes.csv")
active_skills=storedatabase(directory,"active_skills.csv")
card_active_skills=storedatabase(directory,"card_active_skills.csv")
passive_skills=storedatabase(directory,"passive_skills.csv")
passive_skill_set_relations=storedatabase(directory,"passive_skill_set_relations.csv")


directory="assets/"

scrapeallunitassetsv2(cards)

#print(qualifyAsDFE(card, card_awakening_routes, cards,active_skills,card_active_skills,passive_skills,passive_skill_set_relations))
#print(activeSkillTransformationReverseUnit(card, cards, passive_skills, passive_skill_set_relations))
#print(TransformationReverseUnit(card, cards, passive_skills, passive_skill_set_relations))
#print(dokkanreverseunit(card,card_awakening_routes, cards))