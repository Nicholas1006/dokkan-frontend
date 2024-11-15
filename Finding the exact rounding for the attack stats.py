import math
import itertools
from progress.bar import Bar
from decimal import *
target=13123920
base=18040
Lead=5
SOTPassive=3.54
Links=1.47
Ki_multiplier=2
MOTPassive=2
SA_Multiplier=6.99
components=[base,Lead,SOTPassive,Links,Ki_multiplier,MOTPassive,SA_Multiplier]

def multiply_in_certain_order(components):
    result = Decimal(1)
    for component in components:
        if(component[1]=="Ceil"):
            result = math.ceil(Decimal(result) * Decimal(component[0]))
        elif(component[1]=="Floor"):
            result = math.floor(result * Decimal(component[0]))
        elif(component[1]=="Round"):
            result = round(Decimal(result) * Decimal(component[0]))
        else:
            result = Decimal(result) * Decimal(component[0])
    return(result)

def change_words_to_numbers(possible_list,dataset):
    new_list=[]
    for component in possible_list:
        if(component[0]=="Base"):
            new_list.append([dataset[1],component[1]])
        elif(component[0]=="Lead"):
            new_list.append([dataset[2],component[1]])
        elif(component[0]=="SOTPassive"):
            new_list.append([dataset[3],component[1]])
        elif(component[0]=="Links"):
            new_list.append([dataset[4],component[1]])
        elif(component[0]=="Ki_multiplier"):
            new_list.append([dataset[5],component[1]])
        elif(component[0]=="MOTPassive"):
            new_list.append([dataset[6],component[1]])
        elif(component[0]=="SA_Multiplier"):
            new_list.append([dataset[7],component[1]])
    return(new_list)




# The original list of elements
elements = ['Base', 'Lead', 'SOTPassive', 'Links', 'Ki_multiplier', 'MOTPassive', 'SA_Multiplier']

# The possible forms each element can take
forms = ["Ceil", "Floor", "Round", "None"]






datasets=[]
datasets.append([16810904 , 19400 , 5 , 3.77 , 1.72 , 2   , 1.77 , 7.55])
datasets.append([9070307  , 17870 , 5 , 4.54 , 1.72 , 2   , 1    , 6.5])
datasets.append([8615550  , 19375 , 5 , 3.5  , 1.4  , 2   , 1.5  , 6.05])
correctCondition=[1,2,3]
# Generate all possible combinations of forms for the 7 elements
all_form_combinations = list(itertools.product(forms, repeat=len(elements)))

# Now, for each form combination, generate all permutations of the element order
working_lists=[]
all_possible_lists = []
bar=Bar("Generating all possible lists", max=len(all_form_combinations))
for form_combination in list(all_form_combinations):
    bar.next()
    # Pair each element with its form
    paired_elements = list(zip(elements, form_combination))
                            
    # Generate all permutations of the paired elements
    permuted_lists = itertools.permutations(paired_elements)
    for permuted_list in permuted_lists:
        

        correct=[]
        for dataset in datasets:
            if(multiply_in_certain_order(change_words_to_numbers(permuted_list,dataset))==Decimal(dataset[0])):
                correct.append(datasets.index(dataset)+1)
        if(correct!=[]):
            all_possible_lists.append(list(permuted_list)+[correct])
        if(correct==correctCondition):
            working_lists.append(permuted_list)
bar.finish()



import csv

with open('out.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(all_possible_lists)

with open('out2.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(working_lists)

print(working_lists)

print("Done")