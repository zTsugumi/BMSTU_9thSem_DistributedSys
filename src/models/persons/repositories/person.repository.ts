import { EntityRepository, Repository } from 'typeorm';
import { Person } from '../entities/person.entity';
import { PersonRequestDTO } from '../dto/person.dto';

@EntityRepository(Person)
export class PersonRepository extends Repository<Person> {
  public async createPerson(personRequest: PersonRequestDTO): Promise<Person> {
    const person = new Person();
    person.name = personRequest.name;
    person.age = personRequest.age;
    person.address = personRequest.address;
    person.work = personRequest.work;

    await person.save();
    return person;
  }

  public async editPerson(person: Person, personRequest: PersonRequestDTO): Promise<Person> {
    person.name = personRequest.name;
    person.age = personRequest.age ?? person.age;
    person.address = personRequest.address ?? person.address;
    person.work = personRequest.work ?? person.work;

    await person.save();
    return person;
  }
}
