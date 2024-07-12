package ru.kata.spring.boot_security.demo.dao;




import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.model.User;


import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import java.util.List;

@Repository
public class UserDaoImp implements UserDao {

   @PersistenceContext
   private final EntityManager entityManager;

    public UserDaoImp(EntityManager entityManager) {
        this.entityManager = entityManager;

    }

    @Override
    public List<User> getAll() {
        return entityManager.createQuery("FROM User", User.class).getResultList();
    }

    @Override
    public void updateUser(User user) {
        entityManager.merge(user);
    }

    @Override
    public void deleteUser(long id) {
        entityManager.remove(entityManager.find(User.class, id));
    }

    @Override
    public User showUser(Long id) {
        return entityManager.find(User.class, id);
    }

    @Override
    public void addUser(User user) {
        entityManager.persist(user);
    }
}
